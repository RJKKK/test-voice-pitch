import {Locale} from '../../data'
export default class Top {
    constructor(index,data){
        this.total_eng = -1;
        this.left_top = null;
        this.left_low_eng = 0;
        this.overtone_count = 1;
        this.valid = true;
        this.pure = 0;
        this.data = data;
        this.right_index = index;
        this.eng = this.data.spectrum[index];
        this.ori_eng = this.data.ori_spectrum[index];
        this.left_index = this.extend(index, -1);
        this.right_index = this.extend(index, 1);
        this.index = (this.left_index + this.right_index) / 2;
        if (this.eng < this.data.min_eng) this.valid = false;
    }
    extend(index, delta){
        // eslint-disable-next-line no-constant-condition
        while (true) {
            index += delta;
            if (index < 0 || index > this.data.x_max) return index - delta;
            let eng = this.data.spectrum[index];
            if (eng > this.eng) {
                return index - delta;
            } else if (eng + this.data.top_eng_range < this.eng) {
                return index - delta;
            }
        }
    }
    calculateParent(i){
        if (i == 1) return true;
        let parent_index = this.index * i;
        if (parent_index > this.data.x_max) {
            return false;
        }
        let parent = this.data.getTop(this.left_index * i, Math.ceil(this.right_index * i));

        if (!parent || parent.eng < this.data.accept_eng) {
            return false;
        }
        this.parents[i] = parent;
        this.overtone_count++;
        if (i < 4 || parent == this.data.highest_top) {
            this.left_index = Math.max(this.left_index, (parent.left_index - 1) / i);
            this.right_index = Math.min(this.right_index, (parent.right_index + 1) / i);
        }
        this.max_oevrtone_ori_eng = Math.max(this.max_oevrtone_ori_eng, parent.ori_eng);
        this.addTotalEng(parent.eng);
        return true;
    }
    calculate(highest_index){
        if (this.total_eng > 0) return 0;
        this.addTotalEng(this.eng);
        this.self_total_eng = this.total_eng;
        this.parents = [];
        this.overtone_count = 1;
        this.max_oevrtone_ori_eng = 0;
        this.accept_eng = 0;
        this.left_index--;
        this.right_index++;
        this.calculateParent(highest_index);
        for (let i = 2; i < 50; ++i) {
            if (i != highest_index) {
                if (!this.calculateParent(i)) break;
            }
        }
        this.index = (this.left_index + this.right_index) / 2;
        return this.total_eng;
    }
    getAvgTotalEng(){
        return this.total_eng / this.overtone_count;
    }
    getPure(){
        return this.total_eng / this.self_total_eng;
    }
    getPureName(s){
        let pure = this.getPure();
    let freq = this.data.indexToFreq(this.index,s);
    if (freq > 900 && pure > -8) {
        return Locale.get('head_voice');
    }
    if (pure < 1.5) {
        return Locale.get('super_fake_voice');
    } else if (pure < 3) {
        return Locale.get('pure_fake_voice');
    } else if (pure < 4) {
        return Locale.get('fake_voice');
    } else if (pure < 5) {
        return Locale.get('half_fake_voice');
    } else if (pure < 6) {
        return Locale.get('mix_voice');
    } else if (pure < 20) {
        return Locale.get('modal_voice');
    } else {
        return Locale.get('pure_modal_voice');
    }
    }
    addTotalEng(eng){
        let sone = Math.pow(2, (eng - 40) / 10);
        this.total_eng += sone;
    }
}