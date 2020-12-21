<template>
	<MainLayout>
		<div class="pa-3">
			<div class="title">LUYỆN TẬP</div>
			<BaseButton
				color="grey"
				icon="back"
				@click="$router.push('/hci-menu')"
				style="margin: 0  0 20px 0"
			/>
			<BaseTextArea v-model="txtArea" />
			<BaseInput v-model="input" placeholder="Nhập từ phím" />
			<BaseTextArea v-model="txtArea2" />
		</div>
		<Wrapper class="d-flex justify-space-between">
			<div>
				<ul id="keyboard">
					<li class="symbol">
						<span class="off">`</span><span class="on">~</span>
					</li>
					<li class="symbol">
						<span class="off">1</span><span class="on">!</span>
					</li>
					<li class="symbol">
						<span class="off">2</span><span class="on">@</span>
					</li>
					<li class="symbol">
						<span class="off">3</span><span class="on">#</span>
					</li>
					<li class="symbol">
						<span class="off">4</span><span class="on">$</span>
					</li>
					<li class="symbol">
						<span class="off">5</span><span class="on">%</span>
					</li>
					<li class="symbol">
						<span class="off">6</span><span class="on">^</span>
					</li>
					<li class="symbol">
						<span class="off">7</span><span class="on">&amp;</span>
					</li>
					<li class="symbol">
						<span class="off">8</span><span class="on">*</span>
					</li>
					<li class="symbol">
						<span class="off">9</span><span class="on">(</span>
					</li>
					<li class="symbol">
						<span class="off">0</span><span class="on">)</span>
					</li>
					<li class="symbol">
						<span class="off">-</span><span class="on">_</span>
					</li>
					<li class="symbol">
						<span class="off">=</span><span class="on">+</span>
					</li>
					<li class="delete lastitem">delete</li>
					<li class="tab">tab</li>
					<li class="letter">q</li>
					<li class="letter">w</li>
					<li class="letter">e</li>
					<li class="letter">r</li>
					<li class="letter">t</li>
					<li class="letter">y</li>
					<li class="letter">u</li>
					<li class="letter">i</li>
					<li class="letter">o</li>
					<li class="letter">p</li>
					<li class="symbol">
						<span class="off">[</span><span class="on">{</span>
					</li>
					<li class="symbol">
						<span class="off">]</span><span class="on">}</span>
					</li>
					<li class="symbol lastitem">
						<span class="off">\</span><span class="on">|</span>
					</li>
					<li class="capslock">caps lock</li>
					<li class="letter">a</li>
					<li class="letter">s</li>
					<li class="letter">d</li>
					<li class="letter">f</li>
					<li class="letter">g</li>
					<li class="letter">h</li>
					<li class="letter">j</li>
					<li class="letter">k</li>
					<li class="letter">l</li>
					<li class="symbol">
						<span class="off">;</span><span class="on">:</span>
					</li>
					<li class="symbol">
						<span class="off">'</span><span class="on">&quot;</span>
					</li>
					<li class="return lastitem">return</li>
					<li class="left-shift">shift</li>
					<li class="letter">z</li>
					<li class="letter">x</li>
					<li class="letter">c</li>
					<li class="letter">v</li>
					<li class="letter">b</li>
					<li class="letter">n</li>
					<li class="letter">m</li>
					<li class="symbol">
						<span class="off">,</span><span class="on">&lt;</span>
					</li>
					<li class="symbol">
						<span class="off">.</span><span class="on">&gt;</span>
					</li>
					<li class="symbol">
						<span class="off">/</span><span class="on">?</span>
					</li>
					<li class="right-shift lastitem">shift</li>
					<li class="space lastitem">&nbsp;</li>
				</ul>
			</div>
			<img src="/img/icons/stenoKeyboard.png" height="200px" />
		</Wrapper>
	</MainLayout>
</template>
<script>
export default {
	data() {
		return {
			txtArea: 'ĐÂY LÀ ĐOẠN VĂN MẪU',
			input: '',
			correct: 0,
			mistake: 0
		}
	},
	computed: {
		txtSample() {
			return this.txtArea.split(' ')
		},
		txtArea2() {
			return this.txtSample.length > 0
				? 'Số từ đúng trên tổng số từ: ' +
						this.correct +
						'/' +
						5 +
						'\n' +
						'Số từ sai: ' +
						this.mistake
				: 'Số từ sai trên tổng số từ đã gõ: ' +
						this.mistake +
						'/' +
						this.correct +
						this.mistake +
						'\n' +
						'Độ chính xác: ' +
						Number(
							(this.correct / (this.correct + this.mistake)) * 100
						).toFixed(2) +
						'%'
		}
	},
	watch: {
		input: {
			handler(val) {
				if (val && val.includes(' ')) {
					let inputVal = val.split(' ')[0]
					if (this.txtSample[0].toLowerCase() === inputVal.toLowerCase()) {
						this.correct += 1
						this.txtSample.shift()
						inputVal = ''
						this.input = ''
						let newTxt = this.txtSample.join(' ')
						this.txtArea = newTxt
						this.$message.success('Gõ đúng rồi')
						if (this.txtSample[0] === '') {
							this.txtSample.length = 0
							this.$message.success('Bạn đã hoàn thành bạn luyện gõ')
							return
						}
					} else {
						this.$message.error('Gõ sai rồi')
						this.input = ''
						this.mistake += 1
					}
				}
			},
			immediate: true
		}
	}
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
body {
	font: 71%/1.5 Verdana, Sans-Serif;
	background: #eee;
}
#container {
	margin: 100px auto;
	width: 688px;
}
#write {
	margin: 0 0 5px;
	padding: 5px;
	width: 671px;
	height: 200px;
	font: 1em/1.5 Verdana, Sans-Serif;
	background: #fff;
	border: 1px solid #f9f9f9;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
}
#keyboard {
	margin: 0;
	padding: 0;
	list-style: none;
}
#keyboard li {
	float: left;
	margin: 0 5px 5px 0;
	width: 40px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	background: #fff;
	border: 1px solid #f9f9f9;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
}
.capslock,
.tab,
.left-shift {
	clear: left;
}
#keyboard .tab,
#keyboard .delete {
	width: 70px;
}
#keyboard .capslock {
	width: 80px;
}
#keyboard .return {
	width: 77px;
}
#keyboard .left-shift {
	width: 95px;
}
#keyboard .right-shift {
	width: 109px;
}
.lastitem {
	margin-right: 0;
}
.uppercase {
	text-transform: uppercase;
}
#keyboard .space {
	clear: left;
	width: 681px;
}
.on {
	display: none;
}
#keyboard li:hover {
	position: relative;
	top: 1px;
	left: 1px;
	border-color: #e5e5e5;
	cursor: pointer;
}
</style>
