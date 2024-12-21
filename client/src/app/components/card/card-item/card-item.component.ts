import { randomColorCard } from '../../../enums/color-cards';
import { Component, Input, OnInit } from '@angular/core';
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
  /**
   * The color of the card.
   */
  @Input() color: ColorCardsType | undefined;

  /**
   * The title of the card.
   */
  @Input() title: { placeholder: string | undefined; text: string | undefined; readonly: boolean } = {
    placeholder: undefined,
    text: undefined,
    readonly: false,
  };

  /**
   * The description of the card.
   */
  @Input() description: { placeholder: string | undefined; text: string | undefined; readonly: boolean } = {
    placeholder: undefined,
    text: undefined,
    readonly: false,
  };

  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  ngOnInit(): void {
    // Generate a random color if the color is not defined.
    if (!this.color) this.color = randomColorCard();
  }
}
