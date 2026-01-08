import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { GrnService } from './grn.service';
import { CreateGrnDto } from './dto/create-grn.dto';

@Controller('grn')
export class GrnController {
  constructor(private readonly grnService: GrnService) {}

  @Post()
  create(@Body() createGrnDto: CreateGrnDto) {
    return this.grnService.create(createGrnDto);
  }

  @Get()
  findAll() {
    return this.grnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.grnService.findOne(id);
  }
}
