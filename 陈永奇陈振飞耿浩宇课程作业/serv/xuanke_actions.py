from aiohttp import web
import psycopg2.errors
from urllib.parse import urlencode

from .config import db_block, web_routes

@web_routes.post('/action/xuanke/add')
async def xuanke_add(request):
    params = await request.post()
    xstu_sn = params.get("stu_sn")
    plan_sn = params.get("plan_sn")
    plan_xueqi = params.get("plan_xueqi")
    
    with db_block() as db:
            db.execute("""
            INSERT INTO xuanke (xstu_sn, plan_sn) 
            VALUES ( %(xstu_sn)s, %(plan_sn)s)
            """, dict(xstu_sn=xstu_sn, plan_sn = plan_sn))
    

    return web.HTTPFound(location="/xuanke")

@web_routes.post('/action/xuanke/delete/{xstu_sn}/{plan_sn}')
async def action_xuanke_delete(request):
   
    xstu_sn = request.match_info.get("xstu_sn")
    plan_sn = request.match_info.get("plan_sn")
 
    with db_block() as db:
         db.execute("""
        DELETE FROM xuanke
            WHERE xstu_sn = %(xstu_sn)s AND plan_sn = %(plan_sn)s
        """, dict(xstu_sn=xstu_sn, plan_sn = plan_sn))
    return web.HTTPFound(location="/xuanke")