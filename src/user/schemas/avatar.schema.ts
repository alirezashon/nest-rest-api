import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Avatar {
  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  userId: string;
  
  @Prop({ type: String, required: true })
  keyV: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
