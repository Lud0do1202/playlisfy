import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pfy-section',
  standalone: true,
  imports: [NgIf],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SectionComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   INPUTS                                   */
  /* -------------------------------------------------------------------------- */
  @Input() title: { tag: 'h1' | 'h2'; text: string } = { tag: 'h2', text: 'Title' };
  @Input() subtitle: string | undefined;
}
