package com.pasantia.pasantia.common

import java.time.LocalDateTime

interface SoftDeletable {
    var active: Boolean
    var deletedAt: LocalDateTime?
}
