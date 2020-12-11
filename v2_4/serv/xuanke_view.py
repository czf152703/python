from aiohttp import web
from aiohttp.web_request import Request
from .config import db_block, web_routes, render_html


@web_routes.get("/xuanke")
async def xuanke_list(request):
    with db_block() as db:
        db.execute("""
        SELECT sn AS stu_sn, name as stu_name FROM student ORDER BY name
        """)
        students = list(db)

        db.execute("""
        SELECT p.sn AS plan_sn,p.plan_xueqi,p.plan_name,p.plan_time,p.plan_jieci,p.plan_didian,c.name as cuo_name,c.sn as cuo_sn
        FROM plan AS p
             INNER JOIN course as c  ON p.plan_name = c.sn
        ORDER BY plan_sn;
        """)
        plans = list(db)
        #print(plans)

        
        


        db.execute("""
        SELECT x.xstu_sn, x.plan_sn, 
            s.name as stu_name, 
            p.plan_name
        FROM xuanke as x
            INNER JOIN student as s ON x.xstu_sn = s.sn
            INNER JOIN plan as p  ON x.plan_sn = p.sn
        ORDER BY xstu_sn, plan_sn;
        """)



        items= list(db)

        #print(items)


    return render_html(request, 'xuanke_list.html',
                       students=students,
                       plans=plans,
                       items=items)


@web_routes.get("/xuanke/delete/{xstu_sn}/{plan_sn}")
async def  xuanke_edit(request):
    xstu_sn = request.match_info.get("xstu_sn")
    plan_sn = request.match_info.get("plan_sn")
    with db_block() as db:
        db.execute("""
         SELECT x.xstu_sn, x.plan_sn, 
            s.name as stu_name, 
            p.plan_name
        FROM xuanke as x
            INNER JOIN student as s ON x.xstu_sn = s.sn
            INNER JOIN plan as p  ON x.plan_sn = p.sn
        where xstu_sn = %(xstu_sn)s and plan_sn = %(plan_sn)s
        ORDER BY xstu_sn, plan_sn;
        """,dict(plan_sn=plan_sn, xstu_sn = xstu_sn))
        record = db.fetch_first()

    with db_block() as db:
        db.execute("""
         SELECT c.name as cuo_name
        FROM plan AS p
             INNER JOIN course as c  ON p.plan_name = c.sn
        where p.sn = %(plan_sn)s
        ORDER BY p.sn;
        """,dict(plan_sn=plan_sn))
        records = db.fetch_first()
        


    return render_html(request, "xuanke_edit.html",record = record,records = records)
        


