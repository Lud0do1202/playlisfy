import { randomColorCard } from '../../../enums/color-cards';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorCardsType } from '../../../enums/color-cards';

/**
 * The card component.
 *
 * * card-inputs: The inputs of the card.
 */
@Component({
  selector: 'pfy-card-item',
  standalone: true,
  imports: [],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent implements OnInit {
  /* -------------------------------------------------------------------------- */
  /*                                   INPUTS                                   */
  /* -------------------------------------------------------------------------- */
  // Color
  @Input() color: ColorCardsType | undefined;

  // Title
  @Input() title: string = '';
  @Input() titlePlaceholder: string = '';
  @Input() titleReadonly: boolean = false;

  // Description
  @Input() description: string = '';
  @Input() descriptionPlaceholder: string = '';
  @Input() descriptionReadonly: boolean = false;

  /* -------------------------------------------------------------------------- */
  /*                                    OUPUT                                   */
  /* -------------------------------------------------------------------------- */
  // Title or description changed
  @Output() onTitleChange = new EventEmitter<string>();
  @Output() onDescriptionChange = new EventEmitter<string>();

  // Handles changes to the title
  titleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onTitleChange.emit(input.value);
  }

  // Handles changes to the description
  descriptionChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onDescriptionChange.emit(input.value);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  ngOnInit(): void {
    // Generate a random color if the color is not defined.
    if (!this.color) this.color = randomColorCard();
  }
}
