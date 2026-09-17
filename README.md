# Aplicativo OS - Start Energia

Projeto Android nativo com:
- Ordem de serviço elétrica/fotovoltaica
- Checklist de inspeção visual, telhado, teste do sistema e disjuntor
- Catálogo de materiais
- Registro fotográfico
- Assinatura digital
- Geração de PDF
- Compartilhamento do PDF
- Compartilhamento de resumo via WhatsApp
- Salvamento local da última OS
- GitHub Actions configurado para gerar APK e publicar em Artifacts

## Como gerar o APK no GitHub pelo celular
1. Envie todos os arquivos deste ZIP para o repositório.
2. Abra a aba Actions.
3. Procure o fluxo **Gerar APK**.
4. Toque nele e use **Run workflow** (ou faça um commit na branch principal).
5. Quando terminar, abra a execução.
6. Em **Artifacts**, toque em **Start-Energia-APK** e baixe o ZIP.
7. Dentro do ZIP estará `app-debug.apk`.

O workflow usa `actions/upload-artifact@v4`, conforme a documentação do GitHub.
