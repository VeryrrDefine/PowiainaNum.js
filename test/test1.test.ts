import P from '../src/index';

describe('P', () => {
    describe('initialization', () => {
        it('should initialize with NaN by default', () => {
            let p = new P();
            expect(p.array.length==1 && isNaN(p.array[0].repeat) && !p.small).toBeTruthy();
        });
        it('should initialize with numbers by default', () => {
            let p = new P(0.2);
            expect(p.sign==1 && p.array.length==1 && p.array[0].repeat==5 && p.small).toBeTruthy();
            let q = new P(1.3);
            expect(q.sign==1 && q.array.length==1 && q.array[0].repeat==1.3 && !q.small).toBeTruthy();
            let r = new P(0);
            expect(r.sign==0 && r.array.length==1 && r.array[0].repeat==Infinity && r.small).toBeTruthy();
            let s = new P(-0.5);
            expect(s.array.length==1 && s.array[0].repeat==2 && s.small && s.sign==-1).toBeTruthy();
            let t = new P(-1);
            expect(t.array.length==1 && t.array[0].repeat==1 && !t.small && t.sign==-1).toBeTruthy();
        });
        it('should initialize large numbers correctly', () => {
            let u = new P(1e18);
            expect(u.array.length==2 && u.array[0].repeat==18 && u.array[1].arrow==1 && !u.small && u.sign==1).toBeTruthy();
        })
        it('should initialize strings correctly', () => {
            let testnum = [
                '0', '1', '-1', '0.01', 
                '0.'+'0'.repeat(1145)+'1', //1e-1146
            ].map((x)=>new P(x));
            console.log(testnum[0])
            expect(testnum[0].sign).toBe(0)
            expect(testnum[0].small).toBeTruthy()
            expect(testnum[0].array.length==1 && testnum[0].array[0].repeat == Infinity).toBeTruthy()
            
            expect(testnum[1].sign==1).toBeTruthy()
            expect(testnum[1].small).toBeFalsy()
            expect(testnum[1].array.length==1 && testnum[1].array[0].repeat == 1).toBeTruthy()

            expect(testnum[2].sign==-1).toBeTruthy()
            expect(testnum[2].small).toBeFalsy()
            expect(testnum[2].array.length==1 && testnum[2].array[0].repeat == 1).toBeTruthy()
            expect(testnum[2].sign==1).toBeTruthy()
            expect(testnum[2].small).toBeTruthy()
            expect(testnum[2].array.length==2 && testnum[2].array[0].repeat == 1146 && testnum[2].array[1].arrow==1).toBeTruthy()
        })
    });
})