// Copyright 2017 Ben North
//
// This file is part of "Simpler Exponential Mazezam Demo".
//
// "Simpler Exponential Mazezam Demo" is free software: you can
// redistribute it and/or modify it under the terms of the GNU General
// Public License as published by the Free Software Foundation, either
// version 3 of the License, or (at your option) any later version.
//
// "Simpler Exponential Mazezam Demo" is distributed in the hope that
// it will be useful, but WITHOUT ANY WARRANTY; without even the
// implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
// PURPOSE.  See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with "Simpler Exponential Mazezam Demo".  If not, see
// <http://www.gnu.org/licenses/>.

jQuery(document).ready(function($)
{
    // IE lacks Math.sign(); provide simple version serving our needs:
    if (!Math.sign)
        Math.sign = function(x) { return x == 0 ? 0 : (x > 0 ? 1 : -1); };

    var GRID_SZ = 24;
    var BIT_STRIDE = 3;
    var BOTTOM_CORRIDOR_Y = 15;

    function printf2d(i)
    { return ((i > 9) ? '' : '0') + i; }

    function repeated(n, x)
    { var xs = []; for (var i = 0; i < n; ++i) xs.push(x); return xs; }

    function align_slices() {
        var dps = [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3];
        var y = 0;
        for (var i = 0; i < 13; ++i) {
            $('#slice-' + printf2d(i)).css({position: 'absolute',
                                            top: (y * GRID_SZ) + 'px',
                                            left: '0px'});
            y += dps[i];
        }
    }

    function left_entry_for_bit(b)
    { return b * BIT_STRIDE + 1; }

    function extend_list(xs, new_xs)
    { xs.push.apply(xs, new_xs); }


    ////////////////////////////////////////////////////////////////////////////////////////

    function Counter() {
        this.id_suffices = ['11', '09', '07', '05', '03', '01'];
        this.reset();
    }

    Counter.prototype.reset = function() {
        this.bits = [0, 0, 0, 0, 0, 0];
        this.sync_display(true);
    }

    Counter.prototype.move_bit = function(b, x)
    { $('#slice-' + this.id_suffices[b]).css({left: (x * GRID_SZ) + 'px'}); }

    Counter.prototype.sync_display = function(is_valid) {
        for (var i = 0; i < 6; ++i)
            this.move_bit(i, this.bits[i]);
        var rev_bits = this.bits.slice().reverse();
        $('#counter-value')
            .html(rev_bits.join(' '))
            .css({'font-weight': is_valid ? 'bold' : 'normal',
                  'color': is_valid ? '#000000': '#606060'});
    }


    ////////////////////////////////////////////////////////////////////////////////////////

    function Player(counter, ui) {
        this.counter = counter;
        this.ui = ui; this.reset();
    }

    Player.prototype.reset = function() {
        this.move(0, BOTTOM_CORRIDOR_Y);
        this.n_moves = 0;
        this.sync_display();
    }

    Player.prototype.move = function(x, y) {
        var dx = Math.abs(this.x - x);
        var dy = Math.abs(this.y - y);
        this.x = x;
        this.y = y;
        this.n_moves += dx + dy;
        this.sync_display();
    }

    Player.prototype.sync_display = function() {
        $('#player').css({display: 'block',
                          position: 'absolute',
                          top: (this.y * GRID_SZ) + 'px',
                          left: (this.x * GRID_SZ) + 'px'});
        $('#n-moves').html(this.n_moves);
    }

    Player.prototype.rmove_fun = function(dx, dy, reps) {
        var p = this;
        var f = function() { p.move(p.x + dx, p.y + dy); };
        return (reps === undefined) ? f : repeated(reps, f);
    }

    Player.prototype.moves_to_bit_entry = function(b) {
        var target_entry_x = left_entry_for_bit(b);
        target_entry_x += ((b == 0) && (this.counter.bits[0] == 1)) ? 1 : 0;
        target_entry_x += (b == 1) ? 1 : 0;
        var dx = target_entry_x - this.x;
        return this.rmove_fun(Math.sign(dx), 0, Math.abs(dx));
    }

    Player.prototype.moves_into_bit_adjuster = function(b) {
        var moves = this.counter.bits[b] ? [] : [this.rmove_fun(-1, 0)];
        extend_list(moves, [this.rmove_fun(0, -1)]);
        return moves;
    }

    Player.prototype.moves_out_of_bit_adjuster = function(b) {
        var moves = [this.rmove_fun(0, 1)];
        extend_list(moves, this.counter.bits[b] ? [] : [this.rmove_fun(1, 0)]);
        return moves;
    }

    Player.prototype.adjust_bit = function(b, gray_is_valid) {
        var p = this;
        var bval0 = p.counter.bits[b];
        var dx0 = bval0 ? -1 : +1;

        var move_and_adjust = function() {
            p.rmove_fun(dx0, 0)();
            p.counter.bits[b] = 1 - bval0;
            p.counter.sync_display(gray_is_valid);
        };

        var nops = repeated(2, function(){});
        return nops.concat([move_and_adjust]).concat(nops);
    }


    ////////////////////////////////////////////////////////////////////////////////////////

    function Scheduler(ui) {
        this.ui = ui;
        this.counter = new Counter();
        this.player = new Player(this.counter, ui);
        this.reset();
    }

    Scheduler.prototype.reset = function() {
        this.pc = 0; this.subpc = 0;
        this.current_chunk = null;
        this.current_step_in_chunk = null;
        this.enabled = false;
        this.counter.reset();
        this.player.reset();
        this.completed = false;
    }

    Scheduler.prototype.incr_pc_and_return = function(moves)
    { this.subpc = 0; this.pc++; return moves; }

    Scheduler.prototype.next_chunk = function() {
        var solution = [0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4,
                        0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5,
                        0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4,
                        0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0];

        if (this.pc == solution.length)
            switch (this.subpc++) {
            case 0: return this.player.moves_to_bit_entry(6);
            case 1: return this.player.rmove_fun(0, -1, 10);
            case 2: return this.player.adjust_bit(4, false);
            case 3: return this.player.rmove_fun(0, -1, 4);
            case 4: return this.player.rmove_fun(1, 0, 1);
            case 5: this.completed = true; return null;
            }

        var b = solution[this.pc];

        if (b == 0) {
            switch (this.subpc++) {
            case 0: return this.player.moves_to_bit_entry(b);
            case 1: return this.player.rmove_fun(0, -1, 2);
            case 2: return this.player.adjust_bit(b, true);
            case 3: return this.incr_pc_and_return(this.player.rmove_fun(0, 1, 2));
            }
        } else if (b == 1) {
            switch (this.subpc++) {
            case 0: return this.player.moves_to_bit_entry(b);
            case 1: return this.player.rmove_fun(0, -1, 3);
            case 2: return this.player.moves_into_bit_adjuster(b);
            case 3: return this.player.adjust_bit(b, true);
            case 4: return this.player.moves_out_of_bit_adjuster(b);
            case 5: return this.incr_pc_and_return(this.player.rmove_fun(0, 1, 3));
            }
        } else {
            switch (this.subpc++) {
            case 0: return this.player.moves_to_bit_entry(b);
            case 1: return this.player.rmove_fun(0, -1, 2 * (b - 1));
            case 2: return this.player.adjust_bit(b - 2, false);
            case 3: return this.player.rmove_fun(0, -1, 3);
            case 4: return this.player.moves_into_bit_adjuster(b);
            case 5: return this.player.adjust_bit(b, false);
            case 6: return this.player.moves_out_of_bit_adjuster(b);
            case 7: return this.player.rmove_fun(0, 1, 3);
            case 8: return this.player.adjust_bit(b - 2, true);
            case 9: return this.incr_pc_and_return(this.player.rmove_fun(0, 1, 2 * (b - 1)));
            }
        }
    }

    Scheduler.prototype.step = function() {
        if (!this.enabled
            || this.completed
           )
            //
            return;

        if (this.current_chunk === null) {
            this.current_chunk = this.next_chunk();
            this.current_step_in_chunk = 0;
        }

        if (this.current_chunk !== null) {
            this.current_chunk[this.current_step_in_chunk++]();
            if (this.current_step_in_chunk == this.current_chunk.length)
                this.current_chunk = null;
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////

    function UI() { this.reset(); }

    UI.prototype.reset = function() {
        this.slow();
    }

    UI.prototype.set_transition_length_1 = function(sel, t)
    { $(sel).css({transition: 'top ' + t + 'ms linear, left ' + t + 'ms linear'}); }

    UI.prototype.set_transition_length = function(t) {
        this.set_transition_length_1('#player', t);
        this.set_transition_length_1('.game-slice', t);
    }

    UI.prototype.slow = function() { this.set_transition_length(200); }
    UI.prototype.fast = function() { this.set_transition_length(50); }
    UI.prototype.speed = function(val) { this[val](); }


    ////////////////////////////////////////////////////////////////////////////////////////

    var ui = new UI();
    var scheduler = new Scheduler(ui);

    align_slices();

    $('input[name=speed]').click(function() { ui.speed($(this).val()); });
    $('#btn-reset').click(function() { scheduler.reset(); $('#btn-start').attr('disabled', false); });
    $('#btn-start').click(function() { $(this).attr('disabled', true); scheduler.enabled = true; });

    window.requestAnimationFrame(function() { scheduler.step(); });
});
