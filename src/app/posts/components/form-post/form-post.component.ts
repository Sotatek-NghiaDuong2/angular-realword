import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { DataPostBody } from '../../../../shared/services/post.service';

@Component({
  selector: 'app-form-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formCreate">
      <input type="text" placeholder="Title" formControlName="title" />
      <input type="text" placeholder="Content" formControlName="content" />
      <button type="button" (click)="handleSubmit()">
        {{ buttonSubmitLabel }}
      </button>
    </form>
    @if (status) {
      <span>
        {{ status }}
      </span>
    }
  `,
  styles: ``,
})
export class FormPostComponent implements OnChanges {
  @Output() submit = new EventEmitter<DataPostBody>();
  @Input() defaultValues: DataPostBody = {
    title: '',
    content: '',
  };
  @Input() buttonSubmitLabel: string = 'Create';
  @Input() status?: string;

  #formBuilder = inject(FormBuilder);

  formCreate = this.#formBuilder.nonNullable.group({
    title: this.defaultValues.title,
    content: this.defaultValues.content,
  });

  handleSubmit() {
    this.submit.emit(this.formCreate.getRawValue());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formCreate.patchValue(this.defaultValues);
  }
}
