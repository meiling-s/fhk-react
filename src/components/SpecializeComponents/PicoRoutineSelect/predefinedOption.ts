export type routineT = {
    id: string,
    engName: string,
    schiName: string,
    tchiName: string
}

export type weekDayT = {
    id: string,
    engName: string,
    schiName: string,
    tchiName: string
}

export const routineType: routineT[] = [
    {
        id: "daily",
        engName: "Daily",
        schiName: "每天",
        tchiName: "每天"
    },
    {
        id: "weekly",
        engName: "Weekly",
        schiName: "每星期",
        tchiName: "每星期"
    },
    {
        id: "specificDate",
        engName: "Specific Date",
        schiName: "指定日期",
        tchiName: "指定日期"
    }
]

export const weekDs: weekDayT[] = [
    {
        id: "mon",
        engName: "Mon",
        schiName: "一",
        tchiName: "一"
    },
    {
        id: "tue",
        engName: "Tue",
        schiName: "二",
        tchiName: "二"
    },
    {
        id: "wed",
        engName: "Wed",
        schiName: "三",
        tchiName: "三"
    },
    {
        id: "thur",
        engName: "Thur",
        schiName: "四",
        tchiName: "四"
    },
    {
        id: "fri",
        engName: "Fri",
        schiName: "五",
        tchiName: "五"
    },
    {
        id: "sat",
        engName: "Sat",
        schiName: "六",
        tchiName: "六"
    },
    {
        id: "sun",
        engName: "Sun",
        schiName: "日",
        tchiName: "日"
    }
]