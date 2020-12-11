import {Column, Entity, Generated, PrimaryColumn} from "typeorm";
import BaseEntity from "./base.entity";

@Entity({name: "users"})
class Users extends BaseEntity{

    @PrimaryColumn({type: "varchar", length: 64, nullable: false})
    @Generated("uuid")
    id: string

    @Column({type: "varchar", nullable: true})
    username: string

    @Column({type: "varchar", nullable: true})
    password: string

    @Column({type: "varchar", nullable: true})
    status: string

    @Column({type: "varchar", nullable: true})
    email: string

    @Column({type: "varchar", nullable: true})
    fullname: string

    @Column({type: "varchar", nullable: true})
    phone: string

    @Column({type: "timestamp", nullable: true})
    lastLogin: Date
}

export default Users
