# Guía de Despliegue en Vercel - ConvertScope

## Pasos para Desplegar

### 1. Preparación Previa
- Asegúrate de que tienes una cuenta en Vercel
- Instala Vercel CLI: `npm i -g vercel`
- Ten listo tu código en un repositorio de GitHub

### 2. Variables de Entorno Necesarias
En Vercel, configura estas variables de entorno:

**Obligatorias:**
```
NODE_ENV=production
```

**Opcionales (para funcionalidad completa):**
```
DATABASE_URL=postgresql://usuario:password@host:puerto/database
EXCHANGE_API_KEY=tu_clave_de_exchangerate_api
```

**Nota:** La app funciona sin base de datos usando almacenamiento en memoria, pero los datos se pierden al reiniciar.

### 3. Comandos de Despliegue

#### Opción A: Desde la Terminal
```bash
# Conecta con tu proyecto
vercel

# Para despliegues posteriores
vercel --prod
```

#### Opción B: Desde GitHub
1. Ve a https://vercel.com/dashboard
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente la configuración

### 4. Configuración Automática
El archivo `vercel.json` ya está configurado para:
- ✅ Servir la aplicación React desde `/`
- ✅ Manejar las rutas API desde `/api/`
- ✅ Configurar variables de entorno
- ✅ Optimizar para producción

### 5. Verificaciones Post-Despliegue
Después del despliegue, verifica:
- [ ] La aplicación carga correctamente
- [ ] Las conversiones funcionan
- [ ] Los favoritos se guardan
- [ ] El modo oscuro funciona
- [ ] Las traducciones español/inglés funcionan
- [ ] Los gráficos históricos cargan

### 6. Dominios Personalizados (Opcional)
Una vez desplegado, puedes configurar un dominio personalizado en:
Settings → Domains en tu proyecto de Vercel

### 7. Troubleshooting Común

**Error de Build:**
- Verifica que todas las dependencias estén en package.json
- Revisa los logs de build en Vercel Dashboard

**Error de API:**
- Confirma que las variables de entorno están configuradas
- Verifica que DATABASE_URL sea accesible desde Vercel

**Error de Rutas:**
- El archivo vercel.json maneja automáticamente las rutas SPA

### 8. Ventajas del Despliegue en Vercel
- ✅ CDN global automático
- ✅ HTTPS incluido
- ✅ Despliegues automáticos desde Git
- ✅ Escalado automático
- ✅ Analytics integrados
- ✅ Dominios .vercel.app gratuitos

## Estructura Post-Despliegue
```
ConvertScope App
├── Frontend (React PWA) → Servido desde CDN
├── API Routes → Funciones serverless
├── Base de Datos → PostgreSQL externa
└── Assets → Optimizados automáticamente
```

## Monitoreo
- Usa Vercel Analytics para ver tráfico
- Configura alertas de errores
- Revisa logs de funciones en el dashboard