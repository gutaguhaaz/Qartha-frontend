
#!/bin/bash

echo "Eliminando carpeta .angular/..."
rm -rf .angular/

echo "Añadiendo archivos al staging..."
git add .

echo "Realizando commit..."
read -p "Mensaje del commit: " commit_msg
git commit -m "$commit_msg"

echo "Haciendo push al repositorio..."
git push origin main

echo "¡Push completado!"
