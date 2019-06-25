const mainUrl = "/ktvapi";

export default {
    loginUrl: mainUrl + "/login",
    allUser: mainUrl + "/user/all",
    addUser: mainUrl + "/user/create",
    changeUser: mainUrl + "/user/update",
    deleteUser: mainUrl + "/user/delete",

    allBox: mainUrl + "/box/all",
    addBox: mainUrl + "/box/create",
    bookBox: mainUrl + "/box/book",
    openBox: mainUrl + "/box/open",

    allMember: mainUrl + "/member/all",
    addMember: mainUrl + "/member/create",
    changeMember: mainUrl + "/member/update",
    deleteMember: mainUrl + "/member/delete",

    allRepair: mainUrl + "/repair/all",
    addRepair: mainUrl + "/repair/create",

    allDrink: mainUrl + "/drink/all",
    addDrink: mainUrl + "/drink/create",
    changeDrink: mainUrl + "/drink/update"
}