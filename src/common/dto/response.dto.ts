import { ApiProperty } from '@nestjs/swagger';

export class Response<TData> {
	@ApiProperty({
		description: 'Request success',
		type: Boolean,
	})
	success: true;

	data: TData;
}
