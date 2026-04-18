import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { CarrinhoModule } from './carrinho/carrinho.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ProdutosModule,
    UsuariosModule,
    PedidosModule,
    AuthModule,
    FreteModule,
    GiftCardsModule,
    PaymentsModule,
    CarrinhoModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SecurityHeadersMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
