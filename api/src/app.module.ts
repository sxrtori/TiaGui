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
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env/database.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const port = Number(configService.get<string>('DB_PORT', '5432'));
        const username = configService.get<string>('DB_USERNAME');
        const password = configService.get<string>('DB_PASSWORD');
        const database = configService.get<string>('DB_DATABASE');
        const sslEnabled =
          configService.get<string>('DB_SSL', 'true').toLowerCase() !== 'false';

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: false,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          extra: {
            max: Number(configService.get<string>('DB_POOL_MAX', '10')),
          },
        };
      },
    }),
    ProdutosModule,
    UsuariosModule,
    PedidosModule,
    AuthModule,
    FreteModule,
    GiftCardsModule,
    PaymentsModule,
    PagamentosModule,
    CarrinhoModule,
    AvaliacoesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SecurityHeadersMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
