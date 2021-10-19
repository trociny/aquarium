/*
 * Project Aquarium's frontend (glass)
 * Copyright (C) 2021 SUSE, LLC.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Interface = {
  name: string;
  config: {
    bootproto: 'dhcp' | 'static';
    addr?: string;
    netmask?: string;
    gateway?: string;
  };
};

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public interfaces(): Observable<Interface[]> {
    const i1: Interface = {
      name: 'interface 1',
      config: {
        bootproto: 'dhcp'
      }
    };
    const i2: Interface = {
      name: 'interface 2',
      config: {
        addr: '173.25.46.155',
        bootproto: 'static',
        netmask: '255.255.255.0',
        gateway: '173.25.46.1'
      }
    };
    return of([i1, i2]);
  }
}