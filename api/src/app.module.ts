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
      envFilePath: [process.cwd() + '/.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('DB_HOST =>', configService.get<string>('DB_HOST'));
        console.log('DB_PORT =>', configService.get<string>('DB_PORT'));
        console.log('DB_USERNAME =>', configService.get<string>('DB_USERNAME'));
        console.log('DB_DATABASE =>', configService.get<string>('DB_DATABASE'));

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: false,
          ssl: {
            rejectUnauthorized: false,
          },
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
