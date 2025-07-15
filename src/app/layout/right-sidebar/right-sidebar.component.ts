import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { RightSidebarService } from '../../core/service/rightsidebar.service';
import { LegalAgentService, ChatMessage, AgentStatus, Document, PreguntaGPT } from './legal-agent.service';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  chatForm!: FormGroup;
  agentStatus: AgentStatus | null = null;
  documentos: Document[] = [];
  documentoSeleccionado: Document | null = null;
  chatMessages: ChatMessage[] = [];
  isLoading = false;
  isTyping = false;
  shouldScrollToBottom = false;

  private destroy$ = new Subject<void>();

  preguntasSugeridas = [
    "¿Qué cláusulas riesgosas detectas en este contrato?",
    "¿Esta cláusula de confidencialidad es demasiado restrictiva?",
    "¿Qué significa esta cláusula en términos simples?",
    "¿Hay algún riesgo legal en este documento?",
    "¿Qué recomendaciones tienes para mejorar este contrato?"
  ];

  constructor(
    private fb: FormBuilder,
    public rightSidebarService: RightSidebarService,
    private legalAgentService: LegalAgentService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.cargarEstadoAgente();
    this.cargarDocumentos();
    this.suscribirseAlHistorial();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.chatForm = this.fb.group({
      mensaje: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]],
      documentoId: [{ value: '', disabled: false }]
    });
  }

  private suscribirseAlHistorial(): void {
    this.legalAgentService.chatHistory$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.chatMessages = messages;
        this.shouldScrollToBottom = true;
      });
  }

  private cargarEstadoAgente(): void {
    // Cambiar por obtenerEstado() cuando el backend esté configurado
    this.legalAgentService.obtenerEstado()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          this.agentStatus = status;
        },
        error: (error) => {
          console.error('Error al cargar estado del agente:', error);
          this.agentStatus = {
            gpt_enabled: false,
            api_key_configured: false,
            status: 'Error de conexión'
          };
        }
      });
  }

  private cargarDocumentos(): void {
    // Cargar documentos disponibles
    this.legalAgentService.obtenerDocumentos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (docs: Document[]) => {
          this.documentos = docs;
        },
        error: (error: any) => {
          console.error('Error al cargar documentos:', error);
        }
      });
  }

  enviarMensaje(): void {
    if (this.chatForm.invalid || this.isLoading || !this.agentStatus?.gpt_enabled) {
      return;
    }

    const mensaje = this.chatForm.get('mensaje')?.value.trim();
    const documentoId = this.chatForm.get('documentoId')?.value || undefined;

    if (!mensaje) return;

    // Agregar mensaje del usuario al historial
    const mensajeUsuario: ChatMessage = {
      id: this.legalAgentService.generarId(),
      texto: mensaje,
      tipo: 'usuario',
      timestamp: new Date()
    };

    this.legalAgentService.agregarMensaje(mensajeUsuario);
    this.chatForm.get('mensaje')?.setValue('');
    this.isLoading = true;
    this.isTyping = true;

    const pregunta: PreguntaGPT = {
      texto: mensaje,
      document_id: documentoId
    };

    this.legalAgentService.consultarAgente(pregunta)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.isTyping = false;
        })
      )
      .subscribe({
        next: (respuesta) => {
          const mensajeAgente: ChatMessage = {
            id: this.legalAgentService.generarId(),
            texto: respuesta.respuesta,
            tipo: 'agente',
            timestamp: new Date(),
            fuente: respuesta.fuente
          };
          this.legalAgentService.agregarMensaje(mensajeAgente);
        },
        error: (error) => {
          console.error('Error al consultar agente:', error);
          const mensajeError: ChatMessage = {
            id: this.legalAgentService.generarId(),
            texto: 'Lo siento, hubo un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
            tipo: 'agente',
            timestamp: new Date()
          };
          this.legalAgentService.agregarMensaje(mensajeError);
        }
      });
  }

  usarPreguntaSugerida(pregunta: string): void {
    this.chatForm.get('mensaje')?.setValue(pregunta);
    this.enviarMensaje();
  }

  onDocumentoSeleccionado(documentoId: string): void {
    this.documentoSeleccionado = this.documentos.find(doc => doc.id === documentoId) || null;
  }

  limpiarChat(): void {
    this.legalAgentService.limpiarHistorial();
    this.chatForm.reset();
    this.documentoSeleccionado = null;
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }

  get isAgentActive(): boolean {
    return this.agentStatus?.gpt_enabled && this.agentStatus?.api_key_configured || false;
  }

  get statusColor(): string {
    if (!this.agentStatus) return 'gray';
    return this.isAgentActive ? 'green' : 'red';
  }

  get statusText(): string {
    if (!this.agentStatus) return 'Cargando...';
    if (this.isAgentActive) return 'Agente Activo';
    if (!this.agentStatus.api_key_configured) return 'API Key no configurada';
    return 'Agente Deshabilitado';
  }

  sendMessage(): void {
    const message = this.chatForm.get('mensaje')?.value?.trim();
    if (!message) return;

    // Add user message to chat
    this.chatMessages.push({
      id: this.legalAgentService.generarId(),
      texto: message,
      tipo: 'usuario',
      timestamp: new Date()
    });

    this.isLoading = true;
    this.chatForm.get('mensaje')?.setValue('');

    // Check if the query might need document context
    const needsDocumentContext = this.queryNeedsDocumentContext(message);

    // Send to legal agent with or without document context
    const pregunta: PreguntaGPT = {
      texto: message,
      document_id: this.chatForm.get('documentoId')?.value || undefined
    };
    const queryMethod = needsDocumentContext
      ? this.legalAgentService.consultarAgente(pregunta) // Modified to use existing method with doc ID
      : this.legalAgentService.consultarAgente(pregunta);

    queryMethod.pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.isTyping = false;
        })
      )
      .subscribe({
      next: (response) => {
        this.legalAgentService.agregarMensaje({
          id: this.legalAgentService.generarId(),
          texto: response.respuesta,
          tipo: 'agente',
          timestamp: new Date(),
          fuente: response.fuente
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) => {
        this.legalAgentService.agregarMensaje({
          id: this.legalAgentService.generarId(),
          texto: 'Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente.',
          tipo: 'agente',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
        console.error('Error querying legal agent:', error);
      }
    });
  }

  private queryNeedsDocumentContext(query: string): boolean {
    const contextKeywords = [
      'mi documento', 'mis documentos', 'este documento', 'este contrato',
      'mi contrato', 'mis contratos', 'el documento que subí',
      'las cláusulas', 'cláusula', 'clausula', 'analiza mi',
      'revisa mi', 'que opinas de', 'qué opinas de'
    ];

    const lowerQuery = query.toLowerCase();
    return contextKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Error al hacer scroll:', err);
    }
  }
}