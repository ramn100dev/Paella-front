import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  // Solo estas rutas se mantienen vivas al salir de ellas; el resto sigue el comportamiento normal de Angular (destruir y recrear)
  private routesToKeepAlive = ['clients'];

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.routesToKeepAlive.includes(route.routeConfig?.path ?? '');
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (route.routeConfig?.path && handle) {
      this.storedRoutes.set(route.routeConfig.path, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig?.path && this.storedRoutes.has(route.routeConfig.path);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig?.path) {
      return null;
    }
    return this.storedRoutes.get(route.routeConfig.path) ?? null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
