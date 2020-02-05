const puppeteer = require("puppeteer");

async function printPDF(tipoFundo, cnpjFundo) {
  const pdfs = [];
  // parametros que o front deve enviar -valores mocados para teste
  tipoFundo = "FICFMMerc";
  cnpjFundo = "29625962000118";
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--window-size=1920, 1080"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 0.2 });
  // url do portal
  await page.goto("http://localhost:81/", {
    waitUntil: "networkidle0"
  });

  let HTML = "<style>";
  await page.click(`#${tipoFundo} > div`).then(async () => {
    await page.click(`#${cnpjFundo}`).then(async () => {
      let classes = await page.evaluate(
        async () => document.querySelector(`#classes`).innerText
      );
      classes = classes.split("\n");
      // para cada classe no fundo
      classes.forEach(async classe => {
        await page.select("#classes", classe).then(async () => {
          await page.click(`#ativos`);
          // pego todos os estilos aplicados na página dinamicamente
          HTML += await page.evaluate(async () => {
            let style;
            let styles = document.getElementsByTagName("style");
            for (var i = 0; i < styles.length; i++) {
              style += styles[i].innerHTML;
            }

            style += "</style>";
            return style;
          });

          // pego as tabelas de ativos/passivos
          HTML += await page.evaluate(
            async () => document.querySelector(".tabelas-fundo").outerHTML
          );

          // renderizo as tabelas junto ao css
          await page.setContent(HTML);

          // escondo alguns elementos que não devem aparecem no pdf
          await page.addStyleTag({
            content: "#carteira {display: none;}"
          });
          await page.addStyleTag({
            content: ".MTableToolbar-searchField-38 {display: none;}"
          });

          // adiciono cada pdf de classe em um array
          pdfs.push(
            await page.pdf({
              format: "A4",
              printBackground: true,
              landscape: true
            })
          );
        });
      });
    });
  });
  //   // await page.addStyleTag({
  //   //   content: "@page:first {margin-top: 0;} body {margin-top: 1cm;}"
  //   // });

  await browser.close();
  return pdfs;
}

module.exports = printPDF;
