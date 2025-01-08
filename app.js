const { exec } = require("child_process");
const readline = require("readline");
const path = require("path");

// Configurar interface para entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Verificar se o yt-dlp está instalado
exec("yt-dlp --version", (error, stdout, stderr) => {
  if (error) {
    console.error(
      "yt-dlp não está instalado. Por favor, instale o yt-dlp primeiro."
    );
    rl.close();
    return;
  }
  console.log(`yt-dlp está instalado. Versão: ${stdout}`);

  // Perguntar a URL do vídeo
  rl.question("Digite a URL do vídeo do YouTube: ", (url) => {
    console.log("Baixando vídeo na melhor qualidade disponível...");

    // Perguntar o formato
    rl.question(
      "Escolha o formato (1 para Vídeo + Áudio, 2 para apenas Vídeo, 3 para apenas Áudio): ",
      (option) => {
        let format = "bestvideo+bestaudio/best";
        if (option === "2") format = "bestvideo";
        else if (option === "3") format = "bestaudio";

        // Perguntar o diretório de saída
        rl.question(
          "Digite o diretório para salvar o vídeo (deixe em branco para salvar na pasta atual): ",
          (outputDir) => {
            // Se o diretório não for fornecido, usa a pasta atual do script
            if (!outputDir) {
              outputDir = path.resolve("."); // Usando o diretório atual do script
            }

            // Comando yt-dlp com o diretório de saída
            const command = `yt-dlp "${url}" -f "${format}" -o "${outputDir}/%(title)s.%(ext)s"`;

            // Executar o comando no terminal
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error(`Erro ao baixar o vídeo: ${error.message}`);
                rl.close();
                return;
              }

              if (stderr) {
                console.error(`Aviso: ${stderr}`);
              }

              console.log(stdout);
              console.log("Download concluído!");
              rl.close();
            });
          }
        );
      }
    );
  });
});
