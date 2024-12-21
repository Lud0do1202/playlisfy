import { Component } from '@angular/core';
import { SectionComponent } from "../../../../components/section/section/section.component";

@Component({
  selector: 'pfy-playlists-page-section-header',
  standalone: true,
  imports: [SectionComponent],
  templateUrl: './playlists-page-section-header.component.html',
  styleUrl: './playlists-page-section-header.component.scss'
})
export class PlaylistsPageSectionHeaderComponent {
}
