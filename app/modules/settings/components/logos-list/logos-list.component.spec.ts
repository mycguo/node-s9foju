import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {LogosListComponent} from './logos-list.component';
import Logo from '../../services/logos/models/logo';
import {SharedModule} from '../../../shared/shared.module';

const fileToAdd = {
  id: '3',
  name: 'testName3',
  lastLogoUpdateTime: 333333
} as Logo;


describe('LaLogosListComponent', () => {
  let component: LogosListComponent;
  let fixture: ComponentFixture<LogosListComponent>;
  let debugEl: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [LogosListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogosListComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    component.logos = [
      {
        id: '1',
        name: 'testName1',
        lastLogoUpdateTime: 222222
      },
      {
        id: '2',
        name: 'testName2',
        lastLogoUpdateTime: 333333
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check files count', () => {
    const files = debugEl.queryAll(By.css('.file'));
    // includes default value
    expect(files.length).toBe(3);
  });

  it('should check files data', () => {
    const files = debugEl.queryAll(By.css('.file'));
    const info = files[2].query(By.css('.main-info'));
    console.log(component.logos);
    expect(info.nativeElement.innerText).toBe(component.logos[1].name);
  });

  it('should click edit button', (done) => {
    const files = debugEl.queryAll(By.css('.file'));
    const actions = files[2].query(By.css('.actions'));
    const buttons = actions.queryAll(By.css('button'));
    component.changeLogo.subscribe(data => {
      expect(data).toBe(component.logos[1]);
      done();
    });
    buttons[0].nativeElement.click();
  });

  it('should add new file', () => {
    component.logos.push(fileToAdd);
    fixture.detectChanges();
    const files = debugEl.queryAll(By.css('.file'));
    const info = files[3].query(By.css('.main-info'));
    expect(info.nativeElement.innerText).toBe(fileToAdd.name);
  });

  describe('changeLogoClick', () => {
    it('should emit the logo to be changed', () => {
      spyOn(component.changeLogo, 'emit');
      const logo = {
        id: '1',
        name: 'testName1',
        lastLogoUpdateTime: 222222
      } as Logo;
      component.changeLogoClick(logo);
      expect(component.changeLogo.emit).toHaveBeenCalledWith(logo);
    });
  });

  describe('deleteLogoClick', () => {
    it('should emit the logo to be deleted', () => {
      spyOn(component.deleteLogo, 'emit');
      const logo = {
        id: '1',
        name: 'testName1',
        lastLogoUpdateTime: 222222
      } as Logo;
      component.deleteLogoClick(logo);
      expect(component.deleteLogo.emit).toHaveBeenCalledWith(logo);
    });
  });

  describe('logoClick', () => {
    it('should not emit the logo if it is already selcted', () => {
      spyOn(component.selectLogo, 'emit');
      const logo = {
        id: '1',
        name: 'testName1',
        lastLogoUpdateTime: 222222
      } as Logo;
      component.activeLogoId = logo.id;
      component.logoClick(logo);
      expect(component.selectLogo.emit).not.toHaveBeenCalled();
    });

    it('should emit the logo is selected', () => {
      spyOn(component.selectLogo, 'emit');
      const logo = {
        id: '1',
        name: 'testName1',
        lastLogoUpdateTime: 222222
      } as Logo;
      component.logoClick(logo);
      expect(component.selectLogo.emit).toHaveBeenCalledWith(logo);
    });
  });

  describe('noLogoClick', () => {
    it('should emit when no logo should be selected', () => {
      spyOn(component.selectEmptyLogo, 'emit');
      component.noLogoClick();
      expect(component.selectEmptyLogo.emit).toHaveBeenCalled();
    });
  });
});
