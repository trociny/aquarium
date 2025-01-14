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
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { marker as TEXT } from '@biesbjerg/ngx-translate-extract-marker';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { translate } from '~/app/i18n.helper';
import { Icon } from '~/app/shared/enum/icon.enum';
import {
  DatatableCellTemplateName,
  DatatableColumn
} from '~/app/shared/models/datatable-column.type';
import { BytesToSizePipe } from '~/app/shared/pipes/bytes-to-size.pipe';
import { Disk, DiskRejectionReasonEnum } from '~/app/shared/services/api/local.service';
import { DiskSolution, NodesService } from '~/app/shared/services/api/nodes.service';

type TableEntry = {
  path?: string;
  rotational: boolean;
  size: number;
  useAs: string;
  isSystemDisk: boolean;
  isStorageDisk: boolean;
  isAvailable: boolean;
  rejectedReasons: string[];
};

@Component({
  selector: 'glass-local-devices-step',
  templateUrl: './local-devices-step.component.html',
  styleUrls: ['./local-devices-step.component.scss']
})
export class LocalDevicesStepComponent implements OnInit {
  @BlockUI()
  blockUI!: NgBlockUI;

  @ViewChild('availableTpl', { static: true })
  public availableTpl!: TemplateRef<any>;

  public icons = Icon;
  public disks: TableEntry[] = [];
  public devicesColumns: DatatableColumn[] = [
    {
      name: TEXT('Path'),
      prop: 'path'
    },
    {
      name: TEXT('Type'),
      prop: 'rotational',
      cellTemplateName: DatatableCellTemplateName.badge,
      cellTemplateConfig: {
        map: {
          true: { value: TEXT('HDD'), class: 'glass-color-theme-gray-600' },
          false: { value: TEXT('NVMe/SSD'), class: 'glass-color-theme-yellow-500' }
        }
      }
    },
    {
      name: TEXT('Size'),
      prop: 'size',
      pipe: new BytesToSizePipe()
    },
    {
      name: TEXT('Function'),
      prop: 'useAs'
    }
  ];

  constructor(private nodesService: NodesService) {}

  ngOnInit(): void {
    this.devicesColumns.unshift({
      name: TEXT('Available'),
      prop: 'isAvailable',
      cellTemplate: this.availableTpl
    });

    this.nodesService.deploymentDiskSolution().subscribe({
      next: (solution: DiskSolution) => {
        const entries: TableEntry[] = [];
        if (solution.systemdisk) {
          const entry = this.consumeDisk(solution.systemdisk);
          entry.isAvailable = true;
          entry.isSystemDisk = true;
          entry.useAs = translate(TEXT('System'));
          entries.push(entry);
        }
        solution.storage.forEach((disk: Disk) => {
          const entry = this.consumeDisk(disk);
          entry.isStorageDisk = true;
          entry.isAvailable = true;
          entry.useAs = translate(TEXT('Storage'));
          entries.push(entry);
        });
        solution.rejected.forEach((rejected: Disk) => {
          const entry = this.consumeDisk(rejected);
          entry.isAvailable = false;
          entries.push(entry);
        });
        this.disks = entries;
      }
    });
  }

  private consumeDisk(disk: Disk): TableEntry {
    const rejectReasons: string[] = this.getRejectedReasons(disk);
    return {
      path: disk.path,
      size: disk.size,
      rotational: disk.rotational,
      useAs: translate(TEXT('N/A')),
      isAvailable: false,
      isSystemDisk: false,
      isStorageDisk: false,
      rejectedReasons: rejectReasons
    };
  }

  private getRejectedReasons(disk: Disk): string[] {
    const reasons: string[] = [];
    disk.rejected_reasons.forEach((reason: DiskRejectionReasonEnum) => {
      switch (reason) {
        case DiskRejectionReasonEnum.InUse:
          reasons.push(translate(TEXT('Currently being used')));
          break;
        case DiskRejectionReasonEnum.TooSmall:
          reasons.push(translate(TEXT('Disk is too small')));
          break;
        case DiskRejectionReasonEnum.RemovableDevice:
          reasons.push(translate(TEXT('Disk is a removable device')));
          break;
        default:
          reasons.push(translate(TEXT('Unknown reason for rejection')));
      }
    });
    return reasons;
  }
}
