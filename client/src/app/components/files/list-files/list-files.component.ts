import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatBytes } from '../../../utils/format';

@Component({
  selector: 'pfy-list-files',
  standalone: true,
  imports: [NgIf],
  templateUrl: './list-files.component.html',
  styleUrl: './list-files.component.scss',
})
export class ListFilesComponent {
  @Input() files: File[] = [];
  @Output() onRemoveFile: EventEmitter<number> = new EventEmitter<number>();

  formatBytes = formatBytes;
}
