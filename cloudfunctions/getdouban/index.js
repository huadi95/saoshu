// 云函数入口文件
const cloud = require("wx-server-sdk");
//网站接口读取
const axios = require("axios");
//豆瓣的解码
const doubanbook = require("doubanbook");
//在node里使用jQuery的语法
const cheerio = require("cheerio");

cloud.init();

async function serchDouban(isbn) {
    //获取书籍数据信息的接口
    const url =
        "https://search.douban.com/book/subject_search?search_text=" + isbn;
    //获取整个书籍的数据
    let serchInfo = await axios.get(url);
    //console.log(serchInfo.data);
    // 获取window.__DATA__ =后面的数据，进行解密；需要的就是括号里的数据
    let reg = /window\.__DATA__ =(.*)/;
    //数据解密
    if (reg.test(serchInfo.data)) {
        //console.log(RegExp.$1);
        let serchData = doubanbook(RegExp.$1)[0];
        return serchData;
    }
}

async function getDouban(isbn) {
    //第一个爬虫，根据isbn查询豆瓣url
    let detailInfo = await serchDouban(isbn);
    console.log(detailInfo)
    let detailPage = await axios.get(detailInfo.url);
    //下面写第二个爬虫
    //cheerio是在node里使用jQuery的语法 解析文档
    const $ = cheerio.load(detailPage.data);
    const info = $("#info")
        .text()
        .split("\n")
        .map(v => v.trim())
        .filter(v => v);
    let author = info[1];
    let price = info[6];
    let tags = [];
    $("#db-tags-section a.tag").each((i, v) => {
        tags.push({
            title: $(v).text()
        });
    });
    let comments = [];
    $("#comments .comment").each((i, v) => {
        comments.push({
            author: $(v).find('.comment-info a').text(),
            content: $(v).find('.comment-content').text(),
            data: $(v).find('.comment-info span').eq(1).text()
        })
    })
    console.log(comments)
    const ret = {
        create_time: new Date().getTime(),
        title: detailInfo.title,
        rate: detailInfo.rating.value,
        images: detailInfo.cover_url,
        url: detailInfo.url,
        summary: $("#link-report .intro").text(),
        comments,
        count: 1,
        price,
        tags,
        author
    };
    return ret;
}
//本地调试的入口
console.log(getDouban("9787010009148"));

// 云函数入口函数,所谓云函数就是一个node项目（或函数）
exports.main = async(event, context) => {
    //云函数的逻辑
    const {
        isbn
    } = event;
    return getDouban(isbn);
};