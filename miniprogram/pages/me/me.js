// miniprogram/pages/me/me.js
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        unlongin: "../../images/img/unlogin.png",
        userInfo: wx.getStorageSync("userInfo") || {}
    },
    onGetUserInfo(e) {
        let userInfo = e.detail.userInfo;
        //需要调用云函数，获取用户的openid
        wx.cloud.callFunction({
            name: "login",
            complete: res => {
                userInfo.openid = res.result.openid;
                this.setData({
                    userInfo
                });
                //写入数据缓存
                wx.setStorageSync("userInfo", userInfo);
            }
        });
    },
    addBook(isbn) {
        //需要调用云函数
        wx.cloud.callFunction({
            name: "getdouban",
            data: {
                isbn
            },
            success: ({
                result
            }) => {
                db.collection("doubanbook")
                    .add({
                        data: result
                    })
                    .then(res => {
                        if (res._id) {
                            wx.showModal({
                                title: "添加成功",
                                content: `《${result.title}》添加成功`
                            });
                        }
                    });
            }
        });
    },
    scanCode() {
        wx.scanCode({
            success: res => {
                //图书的isbn号，去豆瓣获取图书详情
                this.addBook(res.result);
                //console.log(res.result)
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '我'
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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