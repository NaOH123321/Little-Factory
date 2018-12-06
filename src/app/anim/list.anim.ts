import { trigger, stagger, transition, style, animate, query, state } from '@angular/animations';

export const listAnimation = trigger('listAnim', [
    //   transition('* => *', [
    //     query(':enter', style({opacity: 0}), { optional: true }),
    //     query(':enter', stagger(100, [
    //       animate('1s', style({opacity: 1}))
    //     ]), { optional: true }),
    //     query(':leave', style({opacity: 1}), { optional: true }),
    //     query(':leave', stagger(100, [
    //       animate('1s', style({opacity: 0}))
    //     ]), { optional: tsrue })
    //   ])

    // transition(':leave', [
    //     query('*', [
    //         style({ opacity: 1 }),
    //         stagger(0, [
    //             animate('1s', style({ opacity: 0 }))
    //         ])
    //     ], { optional: true }),
    // ])

    state('void', style({ opacity: 0 })),
    state('*', style({ opacity: 1 })),
    transition(':enter', animate('1s')),
    transition(':leave', animate('1s'))
]);







