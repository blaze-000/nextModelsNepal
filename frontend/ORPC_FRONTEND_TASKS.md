# ORPC Frontend Integration Notes

- [ ] Replace Axios usages in admin dashboard with TanStack Query hooks powered by oRPC clients.
- [ ] Implement a shared `createORPCClient` helper that injects the bearer token via `Authorization` header.
- [ ] Add server actions for public marketing pages that call `nav.getNavMenu`/`nav.getVotingState` and pass the payload through props.
- [ ] Co-locate invalidation helpers (`queryClient.invalidateQueries`) alongside `orpcQueryKeys` when mutations land.
- [ ] Once backend adds more procedures, update `NAV_PROCEDURE_KEYS` and add matching query key factories.
