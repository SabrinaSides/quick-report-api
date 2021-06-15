function makeReportsArray(){
    return [
        {
            pt_id: 1,
            room_number: '502',
            pt_initials: 'PH',
            age: '43',
            gender: 'male',
            diagnosis: 'GI bleed',
            allergies: 'statins',
            code_status: 'full',
            a_o: 'x3',
            pupils: 'PERRLA',
            other_neuro: 'tremors',
            heart_rhythm: 'SR 70s',
            bp: '130/80s',
            edema: 'none',
            other_cardiac: 'frequent PVCs',
            lung_sounds: 'clear',
            oxygen: '3L NC',
            other_resp: 'yellow sputum',
            last_bm: '6/1/2021',
            gu: 'voids',
            other_gi_gu: 'n/a',
            skin: 'n/a',
            iv_access: 'RUE PICC',
            additional_report: 'abnormally high K level- 5.4',
            user_id: 1
          },
          {
            pt_id: 2,
            room_number: '822',
            pt_initials: 'VN',
            age: '67',
            gender: 'male',
            diagnosis: 'MI',
            allergies: 'statins',
            code_status: 'full',
            a_o: 'x2',
            pupils: 'PERRLA',
            other_neuro: 'n/a',
            heart_rhythm: 'SR 70s',
            bp: '130/80s',
            edema: 'generalized trace',
            other_cardiac: 'MD wants TED hose on legs',
            lung_sounds: 'bilat lower lobes coarse',
            oxygen: '2L NC with bipap at night',
            other_resp: 'tries to remove O2',
            last_bm: '6/1/2021',
            gu: 'straight cath',
            other_gi_gu: 'wears brief d/t urgency',
            skin: 'stage 1 coccyx',
            iv_access: 'left FA PIV',
            additional_report: 'daughter staying with pt',
            user_id: 1
          },
    ]
}

module.exports = {
    makeReportsArray
}