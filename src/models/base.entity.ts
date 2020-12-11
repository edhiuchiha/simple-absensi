import { CreateDateColumn, UpdateDateColumn} from "typeorm";

class BaseEntity {

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

}

export default BaseEntity
