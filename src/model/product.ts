import { IsNumber, IsOptional, IsString } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany } from "typeorm";
import {transaction} from './transaction'



@Entity()
export class product {

    @PrimaryGeneratedColumn('uuid')
    public id: string

    
    @Column({
    default: null,
    nullable: false
    })
    @IsString()
    public nameProduct: string

        
    @Column({
    default: null,
    nullable: false
    })
    @IsString()
    public descriptionProduct: string

    @Column({
    default: null,
    nullable: false
    })
    @IsString()
    @IsOptional()
    public price: string

    @Column({
    default: 0,
    nullable: false
    })
    @IsNumber()
    public quantity: number


    @Column({
        type: 'longtext',
        nullable: false,
        default: null,
    })
    @IsOptional()
    public imageProduct: string

    
    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date



    @OneToMany (() => transaction, (transaction) => transaction.product)
    public transaction : transaction


}