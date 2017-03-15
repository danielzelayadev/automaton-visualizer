import NFAManipulation from './NFAManipulation'
import PDA from '../automata/pda'
import { upload } from '../core/io'
import { cfg2pda } from '../core/cfg-to-pda'

export default class PDAManipulation extends NFAManipulation {
    constructor(automaton, data) {
        super(automaton, data)

        $('.opt').hide()
        $('.opt.pda').show()
        $('#import-cfg-btn').off('click').click(e => $('#import-cfg').click())
        $('#import-cfg').off('change').change(e => this.importFromCfg())
    }
    importFromCfg() {
        upload($('#import-cfg').prop('files')[0], cfg => {
            const backup = { ...this.automaton }
            try {
                this.buildFromAutomaton(cfg2pda(cfg))
            } catch (e) {
                alert(e.message)
                this.buildFromAutomaton(backup)
            }
        })
        
        $('#import-cfg').val('')
    }
}