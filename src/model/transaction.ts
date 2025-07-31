import { IsNumber, IsOptional, IsString } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { user } from "./user";
import { product } from "./product";


@Entity()
export class transaction {

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
     public quantityOrder: number

    @Column({
     default: 0,
     nullable: false
     })
     @IsNumber()
     public maxAmount: number

     



    
    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date



    @ManyToOne (() => user, (user) => user.transaction)
    @JoinColumn()
    public user : user

    @ManyToOne (() => product, (product) => product.transaction)
    @JoinColumn()
    public product : product


}