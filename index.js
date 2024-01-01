import puppeteer from 'puppeteer';
const url = [
    "https://votcaulongshop.vn/vot-cau-long/vot-cau-long-lining/",
    "https://votcaulongshop.vn/vot-cau-long/vot-cau-long-lining/page/2/",
    "https://votcaulongshop.vn/vot-cau-long/vot-cau-long-lining/page/3/"
];
const main = async () => {
    let result = [];
    const browser = await puppeteer.launch({headless: true});
    const getProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        const productList = await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('.product-small.instock'));
            const data = products.map(product => {
                let onSale, salePriceSplit, oriPriceSplit;
                let oriPrice = '';
                let salePrice = '';
                const title = product.querySelector('.product-title a').innerHTML;
                const onSaleNode = product.querySelector('.onsale');
                const salePriceNode = product.querySelector('.price ins bdi');
                const oriPriceNode = product.querySelector('.price del bdi');
    
                if (onSaleNode === null) {
                    onSale = '0';
                    oriPriceSplit = product.querySelector('.price bdi').innerHTML.split('&nbsp;')[0].split('.');
                    salePriceSplit = oriPriceSplit;
                } else {
                    onSale = onSaleNode.innerHTML;
                    oriPriceSplit = oriPriceNode.innerHTML.split('&nbsp;')[0].split('.');
                    salePriceSplit = salePriceNode.innerHTML.split('&nbsp;')[0].split('.');
                    if (onSale.length == 3) {
                        onSale = onSale.slice(1, 2);
                    } else {
                        onSale = onSale.slice(1, 3);
                    }
                }
    
                for (let i = 0; i < oriPriceSplit.length; i++) {
                    oriPrice = oriPrice.concat(oriPriceSplit[i])
                }
                for (let i = 0; i < salePriceSplit.length; i++) {
                    salePrice = salePrice.concat(salePriceSplit[i])
                }
    
                return {
                    title,
                    oriPrice: Number(oriPrice),
                    salePrice: Number(salePrice),
                    onSale: Number(onSale),
                }
            })
            return data.filter(product => product.oriPrice >= 1500000 && product.oriPrice <= 3500000).sort((a, b) => b.oriPrice - a.oriPrice);
        })
        page.close();
        return productList;
    };

    for (let i = 0; i < url.length; i++) {
        const termProducts = await getProducts(url[i]);
        result = [...result, ...termProducts];
    }
    
    
    console.log(result);
    await browser.close();
};

main();