from fastapi import FastAPI, Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

from auth import verify_access_token

app = FastAPI()

# 自定义中间件
class ConditionalMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 根据请求信息来决定是否执行特定逻辑
        if should_apply_middleware(request):
          access_token =request.headers.get("Authorization")
          # print("Request Headers:", dict(request.headers))
          # print(request.url)
          # print("Access Token:", access_token)

          if not access_token or not access_token.startswith("Bearer "):
              raise HTTPException(status_code=401, detail="Unauthorized,no access_token")
          access_token = access_token.replace("Bearer ", "")
          user_info = verify_access_token(access_token)
          if not user_info:
              raise HTTPException(status_code=401, detail="Unauthorized,no user_info")
          request.state.user = user_info
          response = await call_next(request)
          return response
        else:
          response = await call_next(request)
          return response

# 根据请求信息来决定是否执行中间件的逻辑
def should_apply_middleware(request: Request) -> bool:
    # 在这里根据请求信息进行条件判断
    # 例如，可以根据请求的路径、请求方法、请求头等信息来决定是否应用中间件
    # 下面是一个示例条件，您可以根据您的需求进行修改
    if request.url.path.startswith("/login"):
        return False
    elif request.url.path.startswith("/download_apk"):
        return False
    else:
        return True



