import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroThree } from './hero-three';

describe('HeroThree', () => {
  let component: HeroThree;
  let fixture: ComponentFixture<HeroThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroThree],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroThree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
