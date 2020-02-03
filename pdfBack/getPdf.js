const puppeteer = require('puppeteer');

async function printPDF(tipoFundo, cnpjFundo) {
  tipoFundo = 'FICFMMerc';
  cnpjFundo = '29625962000118';
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--window-size=1920, 1080'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 0.2 })
  await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle0',
  });

  // const session = await page.target().createCDPSession();
  // await session.send('Emulation.setPageScaleFactor', {
  //   pageScaleFactor: 0.5, // 400%
  // });

  let HTML = "<style>";
  await page.click(`#${tipoFundo} > div`).then(async () => {
    await page.click(`#${cnpjFundo}`).then(async () => {
      let classes = await page.evaluate(async () => document.querySelector(`#classes`).innerText)
      classes = classes.split('\n')
      console.log(classes)
      classes.forEach(async classe => {
        await page.select('#classes', classe ).then(async () => {
          await page.click(`#ativos`);
          HTML += await page.evaluate(async () => {
            let style;
            let styles = document.getElementsByTagName('style');
            for(var i=0; i< styles.length; i++) {
              style += styles[i].innerHTML;
            }
            
            style += "</style>"
            return style;
          })
    
          HTML += await page.evaluate(async () => document.querySelector('.tabelas-fundo').outerHTML)
        })
      })
    })
  })
  


  //   await page.click(`#ativos`)
    


  //   // let html = await page.evaluate(async () => document.querySelector('.tabelas-fundo').outerHTML)
    
  //   //   const tabelas = document.querySelector('.tabelas-fundo');
  //   //   return JSON.parse(JSON.stringify(getComputedStyle(tabelas)));
  //   // })
  //   // classes.forEach(async classe => {
  //   // await page.select('#classes', classe );
  //   // // await page.click(`#ativos`).then(async () => {

  //   // // })
  //   // })
  //   // await page.addStyleTag({
  //   //   content: "@page:first {margin-top: 0;} body {margin-top: 1cm;}"
  //   // });

    


  //   // console.log(css);
  //   await page.setContent(HTML)
  //   await page.addStyleTag({
  //     content: "#carteira {display: none;}"
  //   })
  //   await page.addStyleTag({
  //     content: ".MTableToolbar-searchField-38 {display: none;}"
  //   })
  // });
  

  const pdfAtivos = await page.pdf({ format: 'A4', printBackground: true, landscape: true });

  await browser.close();
  return pdfAtivos;
}

module.exports = printPDF;

  // await page.click(`[id='${cnpjFundo}']`)
      // let classes = await page.evaluate(async () => document.querySelector(`#classes`))
      // classes.forEach(async classe => {
      //   await page.click(`#${classe}`);
      //   await page.click('#ativos');
      // })