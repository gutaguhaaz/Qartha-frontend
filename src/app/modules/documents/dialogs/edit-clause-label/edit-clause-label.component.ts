
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

export interface ClauseDialogData {
  clause: {
    _id: string;
    document_id: string;
    clause_text: string;
    label: 'riesgosa' | 'neutra';
    created_at: string;
  };
}

@Component({
  selector: 'app-edit-clause-label',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './edit-clause-label.component.html',
  styleUrls: ['./edit-clause-label.component.scss'],
})
export class EditClauseLabelComponent {
  selectedLabel: 'riesgosa' | 'neutra';

  constructor(
    public dialogRef: MatDialogRef<EditClauseLabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClauseDialogData
  ) {
    this.selectedLabel = data.clause.label;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.selectedLabel !== this.data.clause.label) {
      this.dialogRef.close({ label: this.selectedLabel });
    } else {
      this.dialogRef.close();
    }
  }

  getTruncatedText(text: string, maxLength: number = 150): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
