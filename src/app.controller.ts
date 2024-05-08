import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/commit')
  getApiGithub(@Res() res: Response) {
    // return { url: 'https://api.github.com/repos/phuochungus/api.precious.com/git/refs/heads/main' };
    res.redirect('https://api.github.com/repos/phuochungus/api.precious.com/git/refs/heads/main');
  }
}