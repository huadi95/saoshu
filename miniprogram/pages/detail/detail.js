// miniprogram/pages/detail/detail.js
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        detailBook: [],
        evaContent: "",
        detailInfo: {}

    },
    init() {
        //获取data中的id
        const id = this.data.id;
        //显示加载提示框
        wx.showLoading();
        //通过id在云数据库的doubanbook文件夹进行筛选数据，并将筛选好的数据存放到detailBook上
        db.collection("doubanbook").doc(id)
            .get()
            .then(res => {
                this.setData({
                    detailBook: res.data
                });
                //隐藏加载提示框
                wx.hideLoading();
                //修改头部标题
                wx.setNavigationBarTitle({
                    title: res.data.title
                });
            });
    },
    charChange(e) {
        //获取textarea里面的value值并传给evaContent
        if (e.detail && e.detail.value.length > 0) {
            this.setData({
                evaContent: e.detail.value
            });
        }
    },
    comment() {
        const id = this.data.id;
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        const formatDate = year + "-" + month + "-" + day;
        db.collection("doubanbook")
            .doc(id)
            .update({
                data: {
                    comments: db.command.push([{
                        content: this.data.evaContent,
                        data: formatDate,
                        author: this.data.detailInfo.nickName
                    }])
                }
            });
        this.init();
        this.setData({
            evaContent: ""
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取传过来的id
        this.setData({
            id: options.id
        });
        var userInfo = (wx.getStorageSync("userInfo") || {})
        this.setData({
            detailInfo: userInfo
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        //获取data中的id
        const id = this.data.id;
        //通过id在云数据库中的doubanbook文件中筛选所需要的数据，并对数据中的count进行加1
        db.collection("doubanbook")
            .doc(id)
            .update({
                data: {
                    count: db.command.inc(1)
                }
            });
        //页面初次渲染完成时运行下面函数
        this.init();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
});