import { handle } from '../../packages/api/src/handler.ts'
import type { ApiEnv } from '../../packages/api/src/auth.ts'
export const onRequest = ({ request, env }: { request: Request; env: ApiEnv }) =>
  handle(request, env)
