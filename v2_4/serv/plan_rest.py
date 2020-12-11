import datetime
from aiohttp import web
from dataclasses import asdict
from serv.json_util import json_dumps

from .config import db_block, web_routes




@web_routes.get("/api/plan/list")
async def get_plan_list(request):

    with db_block() as db:
        db.execute("""
        SELECT p.sn AS plan_sn,p.plan_xueqi,p.plan_name,p.plan_time,p.plan_jieci,p.plan_didian,c.name as cuo_name,c.sn as cuo_sn
        FROM plan AS p
             INNER JOIN course as c  ON p.plan_name = c.sn
        ORDER BY plan_sn;
        """)
        data = list(asdict(r) for r in db)
       
    return web.Response(text=json_dumps(data), content_type="application/json")



@web_routes.post("/api/plan")
async def new_plan(request):
    plan = await request.json()
 
    with db_block() as db:
        db.execute("""
        INSERT INTO plan (plan_xueqi,plan_name,plan_time,plan_jieci,plan_didian)
        VALUES( %(plan_xueqi)s, %(plan_name)s, %(plan_time)s, %(plan_jieci)s,%(plan_didian)s) RETURNING sn;
        """, plan)
        record = db.fetch_first()
        plan["plan_sn"] = record.sn

    
    print(plan)

    return web.Response(text=json_dumps(plan), content_type="application/json")


@web_routes.put("/api/plan/{plan_sn:\d+}")
async def update_plan(request):
    plan_sn = request.match_info.get("plan_sn")

    plan = await request.json()

    plan["plan_sn"] = plan_sn
   

    with db_block() as db:
        db.execute("""
        UPDATE plan SET
            plan_xueqi=%(plan_xueqi)s, plan_name=%(plan_name)s, plan_time=%(plan_time)s, plan_jieci=%(plan_jieci)s,plan_didian=%(plan_didian)s
        WHERE sn=%(plan_sn)s;
        """, plan)

    return web.Response(text=json_dumps(plan), content_type="application/json")




@web_routes.delete("/api/plan/{plan_sn:\d+}")
async def delete_plan(request):
    plan_sn = request.match_info.get("plan_sn")

    with db_block() as db:
        db.execute("""
        DELETE FROM plan WHERE sn=%(plan_sn)s;
        """, dict(plan_sn=plan_sn))

    return web.Response(text="", content_type="text/plain")