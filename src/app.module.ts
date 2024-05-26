import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { VariantModule } from './variant/variant.module';
import { OptionModule } from './option/option.module';
import { VariantOptionValueModule } from './variant-option-value/variant-option-value.module';
import { SeedModule } from './seed/seed.module';
import { TypeModule } from './type/type.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { AppController } from 'src/app.controller';
import { AddressModule } from './address/address.module';
import { OptionvalueModule } from './optionvalue/optionvalue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logNotifications: true,
      useUTC: true,
    }),
    FirebaseModule,
    CartModule,
    UserModule,
    ProductModule,
    CategoryModule,
    VariantModule,
    OptionModule,
    VariantOptionValueModule,
    SeedModule,
    TypeModule,
    OrderModule,
    AddressModule,
    OptionvalueModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule { }
