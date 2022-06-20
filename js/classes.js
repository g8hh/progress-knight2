class Task {
    constructor(baseData) {
        this.baseData = baseData
        this.name = baseData.name
        this.level = 0
        this.maxLevel = 0 
        this.xp = 0

        this.xpMultipliers = [
        ]
    }

    getMaxXp() {
        var maxXp = Math.round(this.baseData.maxXp * (this.level + 1) * Math.pow(1.01, this.level))
        return maxXp
    }

    getXpLeft() {
        return Math.round(this.getMaxXp() - this.xp)
    }

    getMaxLevelMultiplier() {
        var maxLevelMultiplier = 1 + this.maxLevel / 10
        return maxLevelMultiplier
    }

    getXpGain() {
        return applyMultipliers(10, this.xpMultipliers)
    }

    increaseXp() {
        this.xp += applySpeed(this.getXpGain())
        if (this.xp >= this.getMaxXp()) {
            var excess = this.xp - this.getMaxXp()
            while (excess >= 0) {
                this.level += 1
                excess -= this.getMaxXp()
            }
            this.xp = this.getMaxXp() + excess
        }
    }
}

class Job extends Task {
    constructor(baseData) {
        super(baseData)   
        this.incomeMultipliers = [
        ]
    }

    getLevelMultiplier() {
        var levelMultiplier = 1 + Math.log10(this.level + 1)
        return levelMultiplier
    }
    
    getIncome() {
        return applyMultipliers(this.baseData.income, this.incomeMultipliers) 
    }
}

class Skill extends Task {
    constructor(baseData) {
        super(baseData)
    }

    getEffect() {
        var effect = 1 + this.baseData.effect * this.level
        return effect
    }

    getEffectDescription() {
        var description = this.baseData.description
        if (description == "Ability XP"){
            description = "技能经验值"
        }
        else if (description == "Class XP"){
            description = "职业经验值"
        }
        else if (description == "Reduced Expenses"){
            description = "费用减少"
        }
        else if (description == "Happiness"){
            description = "幸福感"
        }
        else if (description == "Military Pay"){
            description = "军队收入"
        }
        else if (description == "Military XP"){
            description = "军队经验值"
        }
        else if (description == "Strength XP"){
            description = "力量经验值"
        }
        else if (description == "T.A.A. XP"){
            description = "奥术协会经验值"
        }
        else if (description == "Longer Lifespan"){
            description = "寿元"
        }
        else if (description == "Longer lifespan"){
            description = "寿元"
        }
        else if (description == "Gamespeed"){
            description = "游戏速度"
        }
        else if (description == "T.A.A Pay"){
            description = "奥术协会收入"
        }
        else if (description == "Evil Gain"){
            description = "邪恶获取"
        }
        else if (description == "The Void XP"){
            description = "虚空经验值"
        }
        else if (description == "Reduced Happiness"){
            description = "幸福感减少"
        }
        else if (description == "Max Lvl Multiplier"){
            description = "最高等级倍率"
        }
        else if (description == "Essence Gain"){
            description = "精华获取"
        }
        else if (description == "All XP"){
            description = "所有经验值"
        }
        else if (description == "Class Pay"){
            description = "职业收入"
        }
        else if (description == "Essence + Evil Gain"){
            description = "精华及邪恶获取"
        }
        else if (description == "Galactic Council XP"){
            description = "银河委员会经验值"
        }
        var text = description + " x" + String(this.getEffect().toFixed(2))
        return text
    }
}

class Item {
    constructor(baseData) {  
        this.baseData = baseData
        this.name = baseData.name
        this.expenseMultipliers = [
         
        ]
    }

    getEffect() {
        if (gameData.currentProperty != this && !gameData.currentMisc.includes(this)) return 1
        var effect = this.baseData.effect
        return effect
    }

    getEffectDescription() {
        var description = this.baseData.description
        if (itemCategories["Properties"].includes(this.name)) description = "幸福感"
        if (description == "Ability XP"){
            description = "技能经验值"
        }
        else if (description == "Class XP"){
            description = "职业经验值"
        }
        else if (description == "Happiness"){
            description = "幸福感"
        }
        else if (description == "Military XP"){
            description = "军队经验值"
        }
        else if (description == "Strength XP"){
            description = "力量经验值"
        }
        else if (description == "The Void XP"){
            description = "虚空经验值"
        }
        else if (description == "Magic XP"){
            description = "魔法经验值"
        }
        else if (description == "Fundamentals XP"){
            description = "基本经验值"
        }
        else if (description == "Void Manipulation XP"){
            description = "虚空操控经验值"
        }
        var text = description + " x" + this.baseData.effect.toFixed(1)
        return text
    }

    getExpense() {
        return applyMultipliers(this.baseData.expense, this.expenseMultipliers)
    }
}

class Requirement {
    constructor(elements, requirements) {
        this.elements = elements
        this.requirements = requirements
        this.completed = false
    }

    isCompleted() {
        if (this.completed) {return true}
        for (var requirement of this.requirements) {
            if (!this.getCondition(requirement)) {
                return false
            }
        }
        this.completed = true
        return true
    }
}

class TaskRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "task"
    }

    getCondition(requirement) {
        return gameData.taskData[requirement.task].level >= requirement.requirement
    }
}

class CoinRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "coins"
    }

    getCondition(requirement) {
        return gameData.coins >= requirement.requirement
    }
}

class AgeRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "age"
    }

    getCondition(requirement) {
        return daysToYears(gameData.days) >= requirement.requirement
    }
}

class EvilRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "evil"
    }

    getCondition(requirement) {
        return gameData.evil >= requirement.requirement
    }    
}

class EssenceRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "essence"
    }

    getCondition(requirement) {
        return gameData.essence >= requirement.requirement
    }    
}