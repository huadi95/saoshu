//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
    data: {
        books: [],
        page: 0,
        imgUrl: [{
            img1: "https://img1.doubanio.com/view/subject/l/public/s29793528.jpg",
            img2: "https://img1.doubanio.com/view/subject/l/public/s28388499.jpg",
            img3: "https://img1.doubanio.com/view/subject/l/public/s1441607.jpg"
        }, {
            img1: "https://img9.doubanio.com/view/subject/l/public/s1627655.jpg",
            img2: "https://img9.doubanio.com/view/subject/l/public/s27243455.jpg",
            img3: "https://img9.doubanio.com/view/subject/l/public/s9114855.jpg"
        }, {
            img1: "https://img3.doubanio.com/view/subject/l/public/s5804333.jpg",
            img2: "https://img3.doubanio.com/view/subject/l/public/s27169241.jpg",
            img3: "https://img3.doubanio.com/view/subject/l/public/s8052972.jpg"
        }]
    },
    toDetail(e) {
        //获取数据的唯一id，最好用e.currentTarget.dataset.id获取，用e.target.dataset.id获取的话有时获取到为空
        const id = e.currentTarget.dataset.id;
        //点击进入详情页,并且将id传过去
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + id
        })
    },
    onPullDownRefresh() {
        //下拉刷新
        this.getList(true)
    },
    onReachBottom() {
        //上拉加载下一页
        this.setData({
            page: this.data.page + 1
        }, () => {
            this.getList()
        })
    },
    getList(init) {
        //wx.showLoading是显示加载
        wx.showLoading()
        if (init) {
            //第一次进来的时候page刷新为0
            this.setData({
                page: 0
            })
        }
        //每次加载3页
        const PAGE = 10
        const offset = this.data.page * PAGE
            //collection获取名为doubanbook的云数据,orderBy对获取的云数据进行排序
        let ret = db.collection('doubanbook').orderBy('create_time', 'desc')
            //不是第一页的时候
        if (this.data.page > 0) {
            //skip用于分页
            ret = ret.skip(offset)
        }
        //limit用于指定查询结果集数量上限
        ret = ret.limit(PAGE).get().then(res => {
            if (init) {
                //第一次进来的时候加载的数据
                this.setData({
                    books: res.data
                })
            } else {
                //加载下一页数据
                this.setData({
                    books: [...this.data.books, ...res.data]
                })
            }
            //wx.hideLoading是隐藏加载
            wx.hideLoading()
        })
    },
    onLoad: function() {
        //页面渲染时执行下面函数
        this.getList(true)

        wx.setNavigationBarTitle({
            //头部标题
            title: "首页"
        })
    },
})