import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from './produtos/produtos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { AuthModule } from './auth/auth.module';
import { SecurityHeadersMiddleware } from './common/middleware/security-headers.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { FreteModule } from './frete/frete.module';
import { GiftCardsModule } from './gift-cards/gift-cards.module';
import { PaymentsModule } from './payments/payments.module';
import { StorageModule } from './storage/storage.module';

const isDatabaseEnabled = process.env.ENABLE_DATABASE === 'true';
const databaseUrl = process.env.DATABASE_URL;

const databaseImports =
  isDatabaseEnabled && databaseUrl
    ? [
        // TODO(db): para reativar PostgreSQL em produção, mantenha ENABLE_DATABASE=true
        // e configure DATABASE_URL. Os módulos TypeORM podem voltar a ser importados no AppModule.
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: false,
        }),
      ]
    : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...databaseImports,
    // Fallback atual sem banco: dados em memória para manter a API funcionando.
    StorageModule,
    ProdutosModule,
    UsuariosModule,
    PedidosModule,
    AuthModule,
    FreteModule,
    GiftCardsModule,
    PaymentsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SecurityHeadersMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
